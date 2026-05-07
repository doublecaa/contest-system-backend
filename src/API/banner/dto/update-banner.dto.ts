
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateBannerDto {
  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  gioiThieuHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileGioiThieuHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectGioiThieuHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentGioiThieuHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  gioiThieuFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileGioiThieuFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectGioiThieuFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentGioiThieuFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  theLeHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileTheLeHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectTheLeHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentTheLeHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  theLeFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileTheLeFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectTheLeFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentTheLeFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  faqHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileFaqHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectFaqHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentFaqHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  faqFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileFaqFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectFaqFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentFaqFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  newsHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileNewsHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectNewsHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentNewsHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  newsFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileNewsFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectNewsFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentNewsFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  rankHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileRankHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectRankHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentRankHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  rankFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileRankFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectRankFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentRankFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  workshopHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileWorkshopHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectWorkshopHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentWorkshopHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  workshopFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileWorkshopFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectWorkshopFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentWorkshopFooter: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  dauAnCuocThiHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileDauAnCuocThiHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectDauAnCuocThiHeaderUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentDauAnCuocThiHeader: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  dauAnCuocThiFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  mobileDauAnCuocThiFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  redirectDauAnCuocThiFooterUrl: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  contentDauAnCuocThiFooter: string;
}
