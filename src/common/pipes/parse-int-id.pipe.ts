import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class parseIntIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== "param" || metadata.data !== "id") return value;

        const parsedValue = Number(value);

        if (isNaN(parsedValue)) throw new BadRequestException("ParseIntPipe espera uma string númerica!");
        if (parsedValue < 0) throw new BadRequestException("ParseIntPipe espera um número maior que zero!")

        return parsedValue;
    }
}