import React, { useState } from 'react';
import { ContentState, EditorState, getDefaultKeyBinding } from 'draft-js';
// erxes
import Button from '@erxes/ui/src/components/Button';
import { ErxesEditor, toHTML } from '@erxes/ui/src/components/editor/Editor';
// local
import { ChatEditor } from '../styles';

type Props = {
  setReply: (message: any) => void;
  sendMessage: (message: string) => void;
};

const Editor = (props: Props) => {
  const [editorState, setEditorState] = useState<any>(() =>
    EditorState.createEmpty()
  );

  const handleSendMessage = () => {
    const contentState = editorState.getCurrentContent();

    if (
      contentState.hasText() &&
      contentState
        .getBlockMap()
        .first()
        .getText() !== ''
    ) {
      props.sendMessage(toHTML(editorState));
      props.setReply(null);

      const newState = EditorState.push(
        editorState,
        ContentState.createFromText(''),
        'insert-characters'
      );

      setEditorState(EditorState.moveFocusToEnd(newState));
    }
  };

  const handleKeybind = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      handleSendMessage();
      return null;
    }

    return getDefaultKeyBinding(event);
  };

  return (
    <ChatEditor>
      <ErxesEditor
        editorState={editorState}
        onChange={setEditorState}
        integrationKind=""
        keyBindingFn={handleKeybind}
      />
      <Button onClick={handleSendMessage} style={{ float: 'right' }}>
        Send
      </Button>
    </ChatEditor>
  );
};

export default Editor;
