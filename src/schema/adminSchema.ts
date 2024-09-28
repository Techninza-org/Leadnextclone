export const adminSchema = `
type SubDeptField {
  id: ID!
  name: String!
  fieldType: FieldType!
  value: String
  options: [Options!]
  imgLimit: Int

  order: Int!
  isDisabled: Boolean!
  isRequired: Boolean!

  createdAt: String!
  updatedAt: String!

}
type CompanyDeptForm {
  id: ID!
  name: String!
  subDeptFields: [SubDeptField!]
  createdAt: String!
  updatedAt: String!
}

type Dept {
  id: ID!
  name: String!
  members: [Member!]
  companyDeptForms: [CompanyDeptForm!]
  deptFields: [CompanyDeptForm!]
  createdAt: String!
  updatedAt: String!
}

input CreateBroadcastInput {
  name: String!
  order: Int!
  subCategories: [CreateSubCategoryInput!]!
}

input CreateSubCategoryInput {
  name: String!
  order: Int!
  options: [CreateOptionInput!]!
}
  
input CreateOptionInput {
  name: String!
  type: FieldType!
  order: Int!
  values: [CreateOptionValueInput!]!
}

input CreateOptionValueInput {
  name: String!
  subOptionValues: [CreateOptionValueInput!] # Recursive input for sub-option values
}

type Option {
  id: ID!
  name: String!
  type: FieldType!
  order: Int!
  values: [OptionValue!]!
}

type OptionValue {
  id: ID!
  name: String!
  subOptionValues: [OptionValue!]
}

type SubCategory {
  id: ID!
  name: String!
  order: Int!
  options: [Option!]
}

type BroadcastForm {
  id: ID!
  name: String!
  order: Int!
  subCategories: [SubCategory!]
  createdAt: String!
  updatedAt: String!
}

type CreateDeptResponse {
  dept: Dept
}

enum FieldType {
  INPUT
  DATE
  TEXTAREA
  IMAGE
  SELECT
  RADIO
  CHECKBOX
}

type Options {
  name: String!
  label: String
  value: String
  type: FieldType!
}
  
input OptionsInput {
  label: String!
  value: String!
}

input DeptFieldsInput {
  name: String!
  fieldType: FieldType!
  value: String
  order: Int!
  imgLimit: Int
  isDisabled: Boolean
  isRequired: Boolean
  options: [OptionsInput]
}

input CreateDeptInput {
  name: String!
  subDeptName: String!
  order: Int!
  deptFields: [DeptFieldsInput!]
}

input PlanInput { 
  name: String!
  price: Float!
  duration: Int!
  rank: Int!
  defaultAllowedDeptsIds: [String!]
  description: String!
  isActive: Boolean!
}

type Plan {
  id: ID!
  name: String!
  price: Float!
  duration: Int!
  defaultAllowedDeptsIds: [String!]
  description: String!
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type Subscription  { 
  id: ID!
  planId: String!
  plan: Plan!
  allowedDeptsIds: [String!]
  companyId: String!
  Company: Company!
  createdAt: String!
  updatedAt: String!
}


`;
