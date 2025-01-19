import { defineDevConfig } from "@junobuild/config";

export default defineDevConfig(() => ({
  satellite: {
    collections: {
      datastore: [
        {
          collection: "scenes",
          memory: "heap" as const,
          read: "managed" as const,
          write: "managed" as const,
          mutablePermissions: false,
        },
      ],
      storage: [
        {
          collection: "files",
          memory: "heap" as const,
          read: "managed" as const,
          write: "managed" as const,
          mutablePermissions: false,
        },
      ],
    },
    controllers: [],
  },
}));
