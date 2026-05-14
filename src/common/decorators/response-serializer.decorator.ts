import { SetMetadata } from "@nestjs/common";
import { SERIALIZE_DTO_KEY } from "../constants/serialize-dto.constant";

export const Serialize = (dto: any) => SetMetadata(SERIALIZE_DTO_KEY, dto);