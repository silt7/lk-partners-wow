import yandexIcon from "assets/images/logos/oauth-yandex.svg";

export default function YandexButton() {
  const client_id = process.env.REACT_APP_YANDEX_CLIENT_ID;
  const redirect_uri = process.env.REACT_APP_YANDEX_CLIENT_URI;

  return (
    <a
      href={`https://oauth.yandex.ru/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}`}
    >
      <img src={yandexIcon} alt="" width={24} height={24} />
    </a>
  );
}
