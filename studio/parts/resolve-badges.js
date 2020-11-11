import defaultResolve from 'part:@sanity/base/document-badges'
import { ShopifyBadge } from '../components/shopify-badge'

export default function resolveBadges(props) {
  const badges = defaultResolve(props)
  if (props?.published?.wasDeleted) {
    return [...badges, ShopifyBadge]
  }
  return badges
}
