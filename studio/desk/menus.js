import S from '@sanity/desk-tool/structure-builder'

import { List } from 'phosphor-react'

export const menusMenu = S.listItem()
  .title('Menus')
  .child(S.documentTypeList('menu').title('Menus'))
  .icon(List)
