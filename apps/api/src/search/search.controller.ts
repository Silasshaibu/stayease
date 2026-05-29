import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService, SearchQuery } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query() query: SearchQuery) {
    return this.searchService.search(query);
  }

  @Get('suggestions')
  suggestions(@Query('q') q: string) {
    return this.searchService.suggestions(q || '');
  }
}
