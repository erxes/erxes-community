// import Button from '@erxes/ui/src/components/Button';

// import Box from '@erxes/ui/src/components/Box';
// import { Title } from '@erxes/ui/src/styles/main';
// import React from 'react';
// import { __ } from '@erxes/ui/src/utils/core';
// type Props = {
//   chapterList: any;
// };
// export default function LeftSidebar(props: Props) {
//   const { chapterList } = props;
//   const renderList = (chapter: any) => {
//     return (
//       <Box isOpen={true} title={__(`${chapter}`)} name='showBranch'>
//         <ul>
//           <li>lesson1</li>
//           <li>lesson2</li>
//         </ul>
//         <Button
//           btnStyle='success'
//           type='button'
//           onClick={() => {}}
//           icon='plus-circle'
//         >
//           Add lesson
//         </Button>
//         <Button btnStyle='success' type='button' onClick={() => {}}>
//           Copy lesson from
//         </Button>
//       </Box>
//     );
//   };
//   return (
//     <div>
//       {chapterList.map((chapter: any) => {
//         return (
//           <React.Fragment key={chapter}>{renderList(chapter)}</React.Fragment>
//         );
//       })}
//     </div>
//   );
// }
