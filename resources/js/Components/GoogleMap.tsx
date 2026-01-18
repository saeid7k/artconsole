import { twMerge } from "tailwind-merge"

type Props = {
  coordinates: {
    lat: number | null
    lng: number | null
  } | undefined | null
  zoom?: number
  width?: string | number
  height?: string | number
  mapType?: 'roadmap' | 'satellite'
  hideIfNotFound?: boolean
  className?: string
} & React.IframeHTMLAttributes<HTMLIFrameElement>

function GoogleMap({ coordinates, zoom = 14, width = '100%', height = '400px', mapType = 'roadmap', hideIfNotFound = false, className = '', ...props }: Props) {

  const satelliteFlag = mapType === 'satellite' ? '&t=k' : ''

  const src = () => {
    if (coordinates?.lat && coordinates?.lng) {
      return `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=${zoom}${satelliteFlag}&output=embed`
    } else {
      return `https://maps.google.com/maps?z=${zoom}${satelliteFlag}&output=embed`
    }
  }

  if (hideIfNotFound && (!coordinates || !coordinates.lat || !coordinates.lng)) {
    return null
  }

  return (
    <iframe
      width={width}
      height={height}
      src={src()}
      allowFullScreen
      loading='lazy'
      referrerPolicy='no-referrer-when-downgrade'
      className={twMerge(
        'rounded border-none',
        className
      )}
      {...props}
    />
  )
}

export default GoogleMap;
