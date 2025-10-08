
import { img_path } from '../../environment';


interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?:string;
}

const ImageWithBasePath = (props: Image) => {
  const isFullUrl = props.src.startsWith("http://") || props.src.startsWith("https://");
  const fullSrc = isFullUrl ? props.src : `${img_path}${props.src}`;

  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
    />
  );
};

export default ImageWithBasePath;

