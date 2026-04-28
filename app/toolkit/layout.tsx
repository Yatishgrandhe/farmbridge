import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Operational Toolkit | FarmBridge',
  description:
    'Document checklists, filing sequence, and trusted links for North Carolina producers navigating disaster relief and farm programs.',
}

export default function ToolkitLayout({ children }: { children: React.ReactNode }) {
  return children
}
