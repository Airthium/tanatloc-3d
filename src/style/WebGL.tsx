const style: Record<string, React.CSSProperties> = {
  layout: {
    maxHeight: '100%',
    overflow: 'auto'
  },
  header: {
    background: 'white',
    paddingInline: 0
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '20px',
    gap: '20px'
  },
  card: {
    maxWidth: '600px'
  },
  largeCard: {
    maxWidth: '1200px'
  },
  largeCardBody: {
    display: 'flex',
    gap: '20px'
  },
  textLight: {
    color: 'rgba(0, 0, 0, 0.45)'
  }
}

export default style
