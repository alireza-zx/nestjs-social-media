import { SetMetadata } from "@nestjs/common";
import { ROLE_KEY } from "src/auth/constants/meta-data.consts";

export const Role = (roles: string[]) => SetMetadata(ROLE_KEY, roles);