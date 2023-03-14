import * as compose from 'lodash.flowright';

import { Alert, confirm, withProps } from '@erxes/ui/src/utils';
import {
  FilemanagerFoldersQueryResponse,
  IFolder,
  RemoveFilemanagerFolderMutationResponse
} from '../../types';
import { IRouterProps, MutationVariables } from '@erxes/ui/src/types';
import { mutations, queries } from '../../graphql';

import FolderList from '../../components/folder/FolderList';
import React from 'react';
import gql from 'graphql-tag';
import { graphql, useLazyQuery } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Spinner from '@erxes/ui/src/components/Spinner';

type Props = {
  queryParams: any;
  filemanagerFolders: any[];
  loading: boolean;
  parentFolderId: string;
  setParentId: (id: string) => void;
};

type FinalProps = {
  filemanagerFoldersQuery: FilemanagerFoldersQueryResponse;
} & Props &
  IRouterProps &
  RemoveFilemanagerFolderMutationResponse;

const FolderListContainer = (props: FinalProps) => {
  const { removeMutation, history, filemanagerFoldersQuery } = props;

  const [parentId, setParentId] = React.useState('');

  // const childrens = filemanagerFoldersQuery.filemanagerFolders || [];

  const [getSubfoldersQuery, { data, loading }] = useLazyQuery(
    gql(queries.filemanagerFolders)
  );

  // remove action
  const remove = folderId => {
    confirm().then(() => {
      removeMutation({
        variables: { _id: folderId }
      })
        .then(() => {
          Alert.success('You successfully deleted a folder.');

          history.push('/filemanager');
        })
        .catch(error => {
          Alert.error(error.message);
        });
    });
  };

  const getSubfolders = (folderId: string) => {
    console.log('folderId', folderId);

    setParentId(folderId);

    getSubfoldersQuery({
      variables: { parentId: folderId }
    });
  };

  React.useEffect(() => {
    console.log('parentId', parentId);
  }, [setParentId, getSubfolders]);

  if (loading) {
    return <Spinner />;
  }

  const childFolders = (data && data.filemanagerFolders) || [];

  const { filemanagerFolders } = props;

  console.log('parentId', parentId);

  const folderIndex = filemanagerFolders.findIndex(
    folder => folder._id === parentId
  );
  console.log('folderIndex', folderIndex);

  if (folderIndex !== -1) {
    console.log('childFolders', childFolders);

    filemanagerFolders[folderIndex].childrens = childFolders;
  }

  console.log('filemanagerFolders', filemanagerFolders);

  const updatedProps = {
    ...props,
    childrens: [],
    filemanagerFolders,
    remove,
    getSubfolders
  };

  return <FolderList {...updatedProps} />;
};

const getRefetchQueries = () => {
  return [
    {
      query: gql(queries.filemanagerFolders)
    }
  ];
};

// export default withProps<Props>(
//   compose(
//     graphql<Props, FilemanagerFoldersQueryResponse, { parentId: string }>(
//       gql(queries.filemanagerFolders),
//       {
//         name: 'filemanagerFoldersQuery',
//         options: ({ parentFolderId }: { parentFolderId: string }) => ({
//           variables: {
//             parentId: parentFolderId
//           },
//           fetchPolicy: 'network-only'
//         })
//       }
//     ),
//     graphql<Props, RemoveFilemanagerFolderMutationResponse, MutationVariables>(
//       gql(mutations.filemanagerFolderRemove),
//       {
//         name: 'removeMutation',
//         options: () => ({
//           refetchQueries: getRefetchQueries()
//         })
//       }
//     )
//   )(withRouter<FinalProps>(FolderListContainer))
// );

export default FolderListContainer;
