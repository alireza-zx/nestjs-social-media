import { IsEnum, IsInt, IsOptional, IsString, Max } from "class-validator";
import { OrderBy } from "../enums/order.enum";

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Max(50)
  limit: number = 20;

  @IsOptional()
  @IsInt()
  page: number = 1;

  @IsOptional()
  @IsEnum(OrderBy)
  order: string = OrderBy.CREATEDAT;
}