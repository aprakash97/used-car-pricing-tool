import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

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
}
