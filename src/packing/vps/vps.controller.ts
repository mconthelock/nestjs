import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { VPSService } from './vps.service';
import { CheckVisDto } from './dto/check-vis.dto';
import { ItemDto } from './dto/item.dto';

@ApiTags('Validate Packing')
@Controller('packing/vps')
export class VPSController {
  constructor(private readonly vpsService: VPSService) {}

  /**
   * Check VIS info and return corresponding PIS list
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {CheckVisDto} body Payload containing VIS
   * @param   {Request} request HTTP request to read cookie UserId/UseLocaltb
   * @param   {Response} response HTTP response
   * @return  {Promise<ItemDto[]>} List of items or error message
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check VIS info' })
  @ApiBody({ type: CheckVisDto })
  @ApiResponse({ status: 200, description: 'List of items', type: [ItemDto] })
  async checkVis(@Body() body: CheckVisDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<ItemDto[]> {
    const userId = request.cookies['UserId'];
    const useLocal = request.cookies['UseLocaltb'];
    return this.vpsService.checkVis(body.vis, userId, useLocal);
  }

  /**
   * Save PIS detail for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis and pis
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<ItemDto[]>} Result of saving PIS
   */
  @Post('check-pis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check PIS detail' })
  @ApiResponse({ status: 200, description: 'PIS result', type: [ItemDto] })
  async checkPis(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<ItemDto[]> {
    const { vis, pis } = body;
    const userId = request.cookies['UserId'];
    return this.vpsService.checkPisDetail(vis, pis, userId);
  }

  /**
   * Check barcode input for closing VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis and barcode
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<ItemDto[]>} Result of barcode check
   */
  @Post('check-bc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check barcode input for closing VIS' })
  @ApiResponse({ status: 200, description: 'Barcode check result', type: [ItemDto] })
  async checkInputBc(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<ItemDto[]> {
    const userId = request.cookies['UserId'];
    return this.vpsService.checkInputBc(body.vis, body.barcode, userId);
  }

  /**
   * Handle get lost items for a VIS
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-25
   * @param   {any} body Payload containing vis
   * @param   {Request} request HTTP request to read cookie UserId
   * @param   {Response} response HTTP response
   * @return  {Promise<boolean>} True if lost item exists
   */
  @Post('lost-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lost items for a VIS' })
  @ApiResponse({ status: 200, description: 'Lost item check result', type: Boolean })
  async lostItem(@Body() body: any, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<boolean> {
    const userId = request.cookies['UserId'];
    return this.vpsService.getLostItem(body.vis, userId);
  }
}
