import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [birthInfo, setBirthInfo] = useState({birthDate: "", birthTime: "", birthPlace: ""});
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      console.debug(`birthInfo is ${JSON.stringify(birthInfo)}`)

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ birthInfo: birthInfo }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.info(`Birth chart is ${data.result}`)
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function onChange(event) {
    const { name, value } = event.target;
    setBirthInfo(prevState => ({ ...prevState, [name]: value }));
  }

  return (
    <div>
      <Head>
        <title>Astro AI</title>
        <link rel="icon" href="/form-logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/form-logo.png" className={styles.icon} />
        <form onSubmit={onSubmit}>
          <label htmlFor="birthPlace">Enter birth place</label>
          <input
            type="text"
            name="birthPlace"
            placeholder="e.g. Bulgaria, Kazanlak"
            value={birthInfo.birthPlace}
            onChange={onChange}
          />

          <label htmlFor="birthDate">Enter birth date</label>
          <input
            type="text"
            name="birthDate"
            placeholder="e.g. 30 September 1996"
            value={birthInfo.birthDate}
            onChange={onChange}
          />

          <label htmlFor="birthTime">Enter birth time</label>
          <input
            type="text"
            name="birthTime"
            placeholder="e.g. 15:20"
            value={birthInfo.birthTime}
            onChange={onChange}
          />

          <input type="submit" value="Generate birth chart" />
        </form>

        <pre className={styles.result}>{JSON.stringify(result, null, 2) }</pre>
      </main>
    </div>
  );
}