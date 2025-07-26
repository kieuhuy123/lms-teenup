import { PageHeader } from '@/components/PageHeader'
import { ParentList } from '@/features/parents/ParentList'
import { useParents } from '@/hooks'

export function ParentsPage () {
  const { parents, loading, error, createParent, updateParent, deleteParent } =
    useParents()

  const handleDeleteParent = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ huynh này?')) {
      try {
        await deleteParent(id)
      } catch (error) {
        console.error('Lỗi khi xóa phụ huynh:', error)
      }
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Quản lý phụ huynh'
        description='Thêm, sửa, xóa thông tin phụ huynh trong hệ thống'
      />

      <ParentList
        parents={parents}
        loading={loading}
        error={error}
        onCreateParent={createParent}
        onUpdateParent={updateParent}
        onDeleteParent={handleDeleteParent}
      />
    </div>
  )
}
