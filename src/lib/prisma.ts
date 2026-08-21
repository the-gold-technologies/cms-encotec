import { PrismaClient } from "@prisma/client";
import { createMockPrisma } from "./mockPrisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

const globalForPrisma = global as unknown as { prisma: any };

const isMockMode =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.startsWith("YOUR_") ||
  process.env.DATABASE_URL.includes("hnbxxyyfesdapmxpsppo");

const createRealPrisma = () => {
  const client = new PrismaClient({
    log: ["query"],
  });

  const getModelClient = (modelName: string) => {
    const camelCaseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    return (client as any)[camelCaseName];
  };

  // Cloudinary Deletion Extension
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const monitoredModels = ["Page", "Section", "GlobalConfig"];

          if (monitoredModels.includes(model) && ["update", "upsert", "delete"].includes(operation)) {
            try {
              // Fetch the old record before updating/deleting
              const modelClient = getModelClient(model);
              const oldRecord = modelClient
                ? await modelClient.findUnique({ where: (args as any).where })
                : null;

              const result = await query(args);

              if (oldRecord) {
                const oldUrls = extractCloudinaryUrls(oldRecord);
                
                if (oldUrls.length > 0) {
                  const newUrls = operation === "delete" ? [] : extractCloudinaryUrls(result);
                  const replacedUrls = oldUrls.filter((url) => !newUrls.includes(url));

                  for (const url of replacedUrls) {
                    const publicId = getPublicIdFromUrl(url);
                    if (publicId) {
                      console.log(`[Cloudinary Cleanup] Deleting replaced asset: ${publicId}`);
                      cloudinary.uploader.destroy(publicId).then((res) => {
                        console.log(`[Cloudinary Cleanup] Deletion result for ${publicId}:`, res);
                      }).catch((err) => {
                        console.error(`[Cloudinary Cleanup] Failed to delete ${publicId}:`, err);
                      });
                    }
                  }
                }
              }

              return result;
            } catch (err) {
              console.error("[Cloudinary Cleanup Extension Error]", err);
            }
          }

          return query(args);
        },
      },
    },
  });
};

function extractCloudinaryUrls(obj: any): string[] {
  const urls: string[] = [];

  function walk(value: any) {
    if (typeof value === "string") {
      if (
        value.includes("res.cloudinary.com/dpa93copz/") ||
        value.includes("cloudinary.com/dpa93copz/")
      ) {
        urls.push(value);
      }
    } else if (value && typeof value === "object") {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          walk(value[key]);
        }
      }
    }
  }

  walk(obj);
  return urls;
}

function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/image/upload/");
    if (parts.length < 2) return null;

    const rest = parts[1];
    const cleanRest = rest.replace(/^v\d+\//, "");

    const dotIndex = cleanRest.lastIndexOf(".");
    if (dotIndex === -1) return null;

    return decodeURIComponent(cleanRest.substring(0, dotIndex));
  } catch (err) {
    console.error("Error parsing Cloudinary URL:", err);
    return null;
  }
}

export const getPrisma = () => {
  if (isMockMode) return createMockPrisma();
  if (!globalForPrisma.prisma || !globalForPrisma.prisma.jobApplication) {
    globalForPrisma.prisma = createRealPrisma();
  }
  return globalForPrisma.prisma;
};

export const prisma = getPrisma();


