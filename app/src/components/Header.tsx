import { HeaderMenu } from './HeaderMenu'

export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const {} = props

  return (
    <nav className="flex gap-4 p-2 bg-white border-b shrink-0">
      <HeaderMenu />
    </nav>
  )
}
