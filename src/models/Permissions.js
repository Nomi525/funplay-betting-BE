import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    Role_type: {
      type: String,
      required: false,
    },
    Status: {
      type: Boolean,
      default: false,
    },
    UserManagement: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    Transaction: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    WithdrawlRequest: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    BannerManagement: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    CurrencyManagement: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    GameManagement: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    WinnerDeclaration: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    Periods: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    Query: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    Setting: {
      all: {
        type: Boolean,
        default: false,
        required: false,
      },
      create: {
        type: Boolean,
        default: false,
        required: false,
      },
      update: {
        type: Boolean,
        default: false,
        required: false,
      },
      View: {
        type: Boolean,
        default: false,
        required: false,
      },
      delete: {
        type: Boolean,
        default: false,
        required: false,
      },
    },

    CMS: {
      TermsAndCondition: {
        all: {
          type: Boolean,
          default: false,
          required: false,
        },
        create: {
          type: Boolean,
          default: false,
          required: false,
        },
        update: {
          type: Boolean,
          default: false,
          required: false,
        },
        View: {
          type: Boolean,
          default: false,
          required: false,
        },
        delete: {
          type: Boolean,
          default: false,
          required: false,
        },
      },
      PrivacyPolicy: {
        all: {
          type: Boolean,
          default: false,
          required: false,
        },
        create: {
          type: Boolean,
          default: false,
          required: false,
        },
        update: {
          type: Boolean,
          default: false,
          required: false,
        },
        View: {
          type: Boolean,
          default: false,
          required: false,
        },
        delete: {
          type: Boolean,
          default: false,
          required: false,
        },
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Permission = mongoose.model("Permission", PermissionSchema);
