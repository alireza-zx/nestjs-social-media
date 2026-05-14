import { SetMetadata } from "@nestjs/common";
import { AUTH_TYPE_KEY } from "../../auth/constants/meta-data.consts";
import { AUTH_NONE } from "../../auth/constants/meta-data.consts";

export const Auth = (authType: typeof AUTH_NONE) => SetMetadata(AUTH_TYPE_KEY, authType);