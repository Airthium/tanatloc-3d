const style: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'absolute',
    background: 'none',
    backgroundColor: 'transparent',
    height: 'unset',
    width: '200px',
    zIndex: 10,
    top: 0,
    right: 0,
    padding: 0,
    margin: '10px 10px 0 0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  collapse: {
    backgroundColor: '#f5f5f5'
  },
  collapseBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: 'unset',
    gap: '10px',
    maxHeight: '70vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: '-16px',
    padding: '16px 0'
  },
  divider: {
    margin: '10px 0'
  },
  iconButton: {
    width: '32px',
    height: '32px',
    paddingInlineStart: 0,
    paddingInlineEnd: 0
  }
}

export default style
