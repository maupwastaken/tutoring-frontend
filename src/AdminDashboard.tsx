import css from "./styles/adminDashboard.module.scss";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { ApiRequest, RequestState, TutoringOffer } from "./Models";
import { useContext, useEffect, useState } from "react";
import Alert from "./Components/Alert";
import { OurContext } from "./OurContext";
import { API_HOST } from ".";
import LoadingScreen from "./Components/LoadingScreen";
import { useNavigate } from "react-router";

const SubjectPie = (props: { type: "offers" | "requests" }) => {
  const context = useContext(OurContext);
  const [requestState, setRequestState] = useState<RequestState>(
    RequestState.Loading
  );
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetch(`${API_HOST}/${props.type}`, { credentials: "include" })
      .then((res) => {
        setRequestState(RequestState.Success);
        res.json().then((body) => {
          if (!res.ok) {
            setRequestState(RequestState.Failure);
            Alert(body.msg, "error", context.theme);
          } else {
            let dataObject = body.content.reduce(
              (last: any, x: TutoringOffer) => ({
                ...last,
                ...{
                  [x.subjectName]:
                    last[x.subjectName] === undefined
                      ? 1
                      : last[x.subjectName] + 1,
                },
              }),
              {}
            );
            setData(
              Object.keys(dataObject).map((x) => {
                return { id: x, label: "ASDF", value: dataObject[x] };
              })
            );
          }
        });
      })
      .catch((e) => {
        console.error(e);
        Alert("Irgendwas ist schiefgegangen", "error", context.theme);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id={css.offerChart}>
      {data.length === 0 ? <span>Keine Daten verfübar</span> : null}
      {requestState === RequestState.Success && data.length > 0 ? (
        <ResponsivePie
          data={data}
          colors={{ scheme: "set1" }}
          arcLabel="formattedValue"
          arcLinkLabelsTextColor="var(--text_color)"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          innerRadius={0.5}
          padAngle={2}
          cornerRadius={8}
          theme={{ fontSize: 14 }}
          margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
        />
      ) : null}
      {requestState === RequestState.Loading ? (
        <LoadingScreen loaded={false} />
      ) : null}
    </div>
  );
};

const RequestGraph = (): JSX.Element => {
  const [data, setData] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${API_HOST}/apiRequests`, { credentials: "include" }).then((res) => {
      res.json().then((body) => {
        setLoaded(true);
        const requests: ApiRequest[] = body.content;

        // time of the first request
        const min = requests.reduce(
          (previousValue, currentValue) =>
            new Date(currentValue.time) < previousValue
              ? new Date(currentValue.time)
              : previousValue,
          new Date()
        );

        // time of the last request
        const max = requests.reduce(
          (previousValue: Date, currentValue) =>
            new Date(currentValue.time) > previousValue
              ? new Date(currentValue.time)
              : previousValue,
          new Date()
        );

        // number of hours between the first and last request's time
        let hoursCount =
          Math.abs(max.getTime() - min.getTime()) / (60 * 60 * 1000);

        //array of whole hours as Date
        let hours: Date[] = [];
        for (let i = 0; i < hoursCount; i++) {
          hours.push(new Date(min.getTime() + i * 60 * 60 * 1000));
        }

        let newData = [
          {
            id: "asdf",
            data: hours.map(
              (value: Date) => ({
                x: value.toISOString(),
                y: requests.filter((x) => {
                  let date = new Date(x.time);
                  return (
                    date > value &&
                    date < new Date(value.getTime() + 1000 * 60 * 60)
                  );
                }).length,
              }),
              []
            ),
          },
        ];
        console.log(JSON.stringify(newData));

        setData(newData);
      });
    });
  }, []);
  return (
    <div id={css.requestsChart}>
      {loaded ? (
        <ResponsiveLine
          data={data}
          enablePointLabel={true}
          margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            precision: "hour",
          }}
          axisLeft={{
            tickValues: 5,
          }}
          enableGridX={false}
          enableGridY={false}
          xFormat="time:%Y-%m-%dT%H:%M:%S.%LZ"
          axisBottom={{
            format: "%Y-%m-%d %H:%M",
            tickSize: 10,
            tickPadding: 0,
            tickRotation: 0,
            legend: "timestamp",
            legendPosition: "middle",
            legendOffset: 46,
            tickValues: "every 1 hours",
          }}
          colors={{ scheme: "category10" }}
          theme={{ textColor: "var(--text_color)", fontSize: 14 }}
          curve="linear"
        />
      ) : null}
      {!loaded ? <LoadingScreen loaded={loaded} /> : null}
    </div>
  );
};

export default function AdminDashboard() {
  const context = useContext(OurContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(context.user);
    if (context.user === null) {
      // navigate("/");
    }
  }, []);

  return (
    <div className={css.dashboard}>
      <div className={css["dashboard-content"]}>
        <h1>Admin-Panel</h1>
        <p>
          Wenn du hier bist, bist du entweder wichtig, oder unser Code ist
          kaputt.
        </p>
        <div id={css.stats}>
          <div className={css.stat}>
            <span>{}</span>
          </div>
          <div className={css.stat}></div>
        </div>
        <div id={css.firstCharts}>
          <div>
            <h2>Angebote nach Fach</h2>
            <SubjectPie type="offers" />
          </div>
          <div>
            <h2>Anfragen nach Fach</h2>
            <SubjectPie type="requests" />
          </div>
        </div>
        <div id={css.requestChartContainer}>
          <h2>Requests pro Stunde</h2>
          <RequestGraph />
        </div>
      </div>
    </div>
  );
}
