import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';

@Module({
  providers: [MyGateway],
  exports: [MyGateway], // Export MyGateway so it can be used in other modules
})

export class GatewayModule {}