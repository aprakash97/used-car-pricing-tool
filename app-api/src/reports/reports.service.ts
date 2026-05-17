import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    //only userId will be extracted and saved in db
    return this.repo.save(report);
  }

  async changeApproval(id: string, body: boolean) {
    const report = await this.repo.findOne({
      where: {
        id: +id,
      },
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = body;
    return this.repo.save(report);
  }

  //for complex query createQueryBuilder
  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make =:make', { make: estimateDto.make })
      .andWhere('model =:model', { make: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND +5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND +5', { lat: estimateDto.lat })
      .andWhere('lat - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .andWhere('approved -:approved IS TRUE', {
        approved: estimateDto.approved,
      })
      .orderBy('mileage -:mileage', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }
}
