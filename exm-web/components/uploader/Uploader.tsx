import React from "react"

import uploadHandler from "./uploadHandler"

// import uploadHandler from "./uploadHandler"

export interface IAttachment {
  name: string
  type: string
  url: string
  size?: number
}

type Props = {
  defaultFileList: IAttachment[]
  onChange: (attachments: IAttachment[]) => void
  single?: boolean
  limit?: number
  multiple?: boolean
}

type State = {
  attachments: IAttachment[]
  loading: boolean
}

class Uploader extends React.Component<Props, State> {
  static defaultProps = {
    multiple: true,
    limit: 4,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      attachments: props.defaultFileList || [],
      loading: false,
    }
  }

  handleFileInput = ({ target }) => {
    const files = target.files

    uploadHandler({
      files,

      beforeUpload: () => {
        this.setState({
          loading: true,
        })
      },

      afterUpload: ({ status, response, fileInfo }) => {
        if (status !== "ok") {
          console.log(response)

          return this.setState({ loading: false })
        }

        console.log("sccess")

        // set attachments
        const attachment = { url: response, ...fileInfo }

        const attachments = [attachment, ...this.state.attachments]

        this.props.onChange(attachments)

        this.setState({
          loading: false,
          attachments,
        })
      },
    })

    target.value = ""
  }

  removeAttachment = (index: number) => {
    const attachments = [...this.state.attachments]

    attachments.splice(index, 1)

    this.setState({ attachments })

    this.props.onChange(attachments)
  }

  renderUploadButton() {
    const { multiple, single } = this.props

    if (single && this.state.attachments.length > 0) {
      return null
    }

    return (
      <>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          multiple={multiple}
          onChange={this.handleFileInput}
        />
      </>
    )
  }

  render() {
    const { limit = 4, onChange } = this.props
    const { attachments, loading } = this.state

    return (
      <>
        {loading && <div>Uploading...</div>}
        {/* <AttachmentsGallery
          attachments={attachments}
          limit={limit}
          onChange={onChange}
          removeAttachment={this.removeAttachment}
        /> */}
        {this.renderUploadButton()}
      </>
    )
  }
}

export default Uploader
