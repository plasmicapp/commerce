import { ReactNode, useContext } from 'react'
import { Collapse } from 'antd'
import { PlasmicCanvasContext } from '@plasmicapp/host'

export function Expander({
  className,
  header,
  children,
  defaultExpanded = false,
}: {
  className?: string
  header?: ReactNode
  children?: ReactNode
  defaultExpanded?: boolean
}) {
  const isEditing = useContext(PlasmicCanvasContext)
  const props = defaultExpanded
    ? {
        [isEditing ? 'activeKey' : 'defaultActiveKey']: ['default'],
      }
    : {}
  return (
    <Collapse className={className} {...props}>
      <Collapse.Panel showArrow={false} key={'default'} header={header}>
        {children}
      </Collapse.Panel>
    </Collapse>
  )
}
