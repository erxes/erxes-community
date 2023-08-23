import { gql } from "@apollo/client"

const ordersAddPayment = gql`
  mutation ordersAddPayment(
    $_id: String!
    $cashAmount: Float
    $mobileAmount: Float
    $paidAmounts: [PaidAmountInput]
  ) {
    ordersAddPayment(
      _id: $_id
      mobileAmount: $mobileAmount
      cashAmount: $cashAmount
      paidAmounts: $paidAmounts
    ) {
      _id
    }
  }
`

const ordersSettlePayment = gql`
  mutation ordersSettlePayment(
    $_id: String!
    $billType: String!
    $registerNumber: String
  ) {
    ordersSettlePayment(
      _id: $_id
      billType: $billType
      registerNumber: $registerNumber
    ) {
      success
      lotteryWarningMsg
      errorCode
      message
      getInformation
    }
  }
`

const generateInvoiceUrl = `
  mutation GenerateInvoiceUrl(
    $amount: Float!
    $contentType: String
    $contentTypeId: String
    $customerId: String
    $customerType: String
    $description: String
    $email: String
    $paymentIds: [String]
    $phone: String
  ) {
    generateInvoiceUrl(
      amount: $amount
      contentType: $contentType
      contentTypeId: $contentTypeId
      customerId: $customerId
      customerType: $customerType
      description: $description
      email: $email
      paymentIds: $paymentIds
      phone: $phone
    )
  }
`

const mutations = { ordersAddPayment, ordersSettlePayment, generateInvoiceUrl }

export default mutations
