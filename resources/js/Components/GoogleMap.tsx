type Props = {
  lat: number
  lng: number
  zoom?: number
  width?: string | number
  height?: string | number
  mapType?: 'roadmap' | 'satellite'
  className?: string
} & React.IframeHTMLAttributes<HTMLIFrameElement>

function GoogleMap({ lat, lng, zoom = 14, width = '100%', height = '400px', mapType = 'roadmap', className = '', ...props }: Props) {

  const satelliteFlag = mapType === 'satellite' ? '&t=k' : ''
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}${satelliteFlag}&output=embed`

  return (
    <iframe
      width={width}
      height={height}
      src={src}
      allowFullScreen
      loading='lazy'
      referrerPolicy='no-referrer-when-downgrade'
      className={`rounded ${className}`}
      {...props}
    />
  )
}

export default GoogleMap;
