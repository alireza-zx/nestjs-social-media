import { SetMetadata } from "@nestjs/common";
import { ROLE_KEY } from "../../auth/constants/meta-data.consts";

export const Role = (roles: string[]) => SetMetadata(ROLE_KEY, roles);