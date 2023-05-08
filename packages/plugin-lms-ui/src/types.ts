import { ICategory } from '@erxes/ui-knowledgeBase/src/types';
import { QueryResponse } from '@erxes/ui/src/types';

export type LessonDetailQueryResponse = {
  lmsLessonDetail: any[];
} & QueryResponse;

export type CategoriesQueryResponse = {
  lmsCategories: ICategory[];
} & QueryResponse;
