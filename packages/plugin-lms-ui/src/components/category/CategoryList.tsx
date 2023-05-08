import React from 'react';
import { ICategory } from '@erxes/ui-knowledgeBase/src/types';
import CategoryRow from './CategoryRow';
import {
  Categories,
  KnowledgeBaseRow,
  SectionTitle,
  SectionHead
} from './styles';
import { Box } from '@erxes/ui/src/components';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';

// import { Categories } from './styles';

type Props = {
  currentCategoryId: string;
  topicId: string;
  categories: ICategory[];
  articlesCount: number;
  // remove: (categoryId: string) => void;
};

class CategoryList extends React.Component<Props> {
  groupByParent = (array: any[]) => {
    const key = 'parentCategoryId';

    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);

      return rv;
    }, {});
  };

  renderRow(category, isChild, isParent?) {
    const { currentCategoryId, topicId, articlesCount } = this.props;

    return (
      <CategoryRow
        key={category._id}
        isActive={currentCategoryId === category._id}
        articlesCount={articlesCount}
        topicId={topicId}
        category={category}
        // remove={remove}
        isChild={isChild}
        isParent={isParent}
      />
    );
  }

  render() {
    const { categories } = this.props;

    const subFields = categories.filter(f => f.parentCategoryId);
    const parents = categories.filter(f => !f.parentCategoryId);
    console.log(
      'hello:',
      parents,
      'sub:',
      subFields,
      'categories:',
      categories
    );
    const groupByParent = this.groupByParent(subFields);

    return (
      <Sidebar wide={true} hasBorder={true}>
        {parents.map(category => {
          const childrens = groupByParent[category._id] || [];

          return (
            // <Box
            //   title={category.title}
            //   // isOpen={queryParams.id ? true : false}
            //   isOpen={true}
            //   // extraButtons={extraButtons}
            //   name='showChapter'
            // >
            //   {childrens.map((child) => this.renderRow(child, true))}
            // </Box>
            <React.Fragment key={category._id}>
              {this.renderRow(category, false, childrens.length !== 0)}
              {childrens.map(child => this.renderRow(child, true))}
            </React.Fragment>
          );
        })}
      </Sidebar>
    );
  }
}

export default CategoryList;
