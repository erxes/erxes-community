import Box from '@erxes/ui/src/components/Box';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import {
  FieldStyle,
  SectionBodyItem,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import { renderFullName } from '@erxes/ui/src/utils/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { IClientPortalUser } from '../../types';

export type Props = {
  users: IClientPortalUser[];
  kind: 'client' | 'vendor';
};

export default function Component({ users, kind }: Props) {
  //   const renderActionSection = customer => {
  //     if (!actionSection) {
  //       return;
  //     }

  //     const ActionSection = actionSection;
  //     return <ActionSection customer={customer} isSmall={true} />;
  //   };

  const renderBody = () => {
    if (!users || !users.length) {
      return <EmptyState icon="user-6" text="No data" />;
    }

    return (
      //     <SectionBodyItem>

      //         <SidebarList className="no-link">
      //         {users.map((participant, index) => (
      //             <>
      //           <div
      //             key={index}
      //             style={{
      //               backgroundColor: '#f0f0f0',
      //               borderRadius: '8px',
      //               margin: '5px',
      //             }}
      //           >
      //             {/* <Link
      //               to={`/settings/client-portal/users/details/${participant._id}`}
      //               target="_blank"
      //               rel="noopener noreferrer" */}
      //             {/* > */}
      //               <li>
      //                 <FieldStyle>{kind} portal</FieldStyle>
      //                 <SidebarCounter>
      //                   {participant.clientPortal.name}
      //                 </SidebarCounter>
      //               </li>
      //               <li>
      //                 <FieldStyle>User</FieldStyle>
      //                 <SidebarCounter>
      //                   {renderFullName(participant)}
      //                 </SidebarCounter>
      //               </li>
      //             {/* </Link> */}
      //           </div>
      //           </>

      //     )}
      //     </SidebarList>
      //   </SectionBodyItem>
      <SectionBodyItem>
        <SidebarList className="no-link">
          {users.map((participant, index) => (
            <>
              <Link
                to={`/settings/client-portal/users/details/${participant._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    margin: '5px'
                  }}
                >
                  <li>
                    <FieldStyle>
                      {kind.charAt(0).toUpperCase() + kind.slice(1)} portal
                    </FieldStyle>
                    <SidebarCounter>
                      {participant.clientPortal.name}
                    </SidebarCounter>
                  </li>

                  <li>
                    <FieldStyle>User</FieldStyle>
                    <SidebarCounter>
                      {renderFullName(participant)}
                    </SidebarCounter>
                  </li>
                </div>
              </Link>
            </>
          ))}
        </SidebarList>
      </SectionBodyItem>
    );
  };

  //   const manageContent = props => (
  //     <ParticipantsForm
  //       participants={participants}
  //       renderButton={renderButton}
  //       closeModal={props.closeModal}
  //     />
  //   );

  //   const extraButtons = (
  //     <>
  //       {participants.length && (
  //         <ModalTrigger
  //           title="Manage"
  //           size="xl"
  //           trigger={
  //             <button>
  //               <Icon icon="edit-3" />
  //             </button>
  //           }
  //           content={manageContent}
  //         />
  //       )}
  //     </>
  //   );

  return (
    <Box title={`${kind}s`} extraButtons={[]} isOpen={true} name="participants">
      {renderBody()}
    </Box>
  );
}
