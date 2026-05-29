import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService, SearchQuery } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private search: SearchService) {}

  @Get()
  search(@Query() query: SearchQuery) {
    return this.search.search(query);
  }

  @Get('suggestions')
  suggestions(@Query('q') q: string) {
    return this.search.suggestions(q || '');
  }
}
