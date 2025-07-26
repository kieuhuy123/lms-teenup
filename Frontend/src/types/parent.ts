export interface Parent {
  _id: string
  name: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateParentData {
  name: string
  phone: string
  email: string
}

export interface UpdateParentData {
  name?: string
  phone?: string
  email?: string
}
