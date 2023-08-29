import { gql } from "@apollo/client"

const posCurrentUser = gql`
  query posCurrentUser {
    posCurrentUser {
      _id
      username
      email
      isOwner

      details {
        avatar
        fullName
        shortName
        position
        description
        operatorPhone
      }
    }
  }
`

const userChanged = gql`
  subscription posUserChanged($userId: String) {
    posUserChanged(userId: $userId)
  }
`

const configFields = `
  _id
  name
  cashierIds
  adminIds
  token
  uiOptions {
    colors
    logo
    favIcon
  }
`

const currentConfig = gql`
  query currentConfig {
    currentConfig {
      ${configFields}
    }
  }
`

const getPaymentConfig = gql`
  query getPaymentConfig {
    currentConfig {
      erxesAppToken
      paymentIds
      paymentTypes
      permissionConfig
    }
  }
`

const getCoverConfig = gql`
  query getCoverConfig {
    currentConfig {
      paymentTypes
      paymentIds
    }
  }
`
const getSettingsConfig = gql`
  query SettingConfig {
    currentConfig {
      branchId
      createdAt
      departmentId
      paymentTypes
      ebarimtConfig {
        ebarimtUrl
        companyRD
      }
    }
  }
`

const getEbarimtConfig = gql`
  query EbarimtConfig {
    currentConfig {
      ebarimtConfig {
        footerText
        hasCopy
      }
      uiOptions {
        receiptIcon
      }
      name
    }
  }
`

const configs = gql`
  query posclientConfigs {
    posclientConfigs {
      name
      token
    }
  }
`

const posUsers = gql`
  query PosUsers {
    posUsers {
      _id
      firstName
      lastName
      email
      primaryPhone
    }
  }
`

const queries = {
  posCurrentUser,
  userChanged,
  currentConfig,
  configs,
  getPaymentConfig,
  getSettingsConfig,
  getEbarimtConfig,
  getCoverConfig,
  posUsers,
}

export default queries
