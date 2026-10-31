import { Global, Module } from '@nestjs/common';
import { MemoryStore } from './store';

@Global()
@Module({
  providers: [MemoryStore],
  exports: [MemoryStore],
})
export class StoreModule {}
