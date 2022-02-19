import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_HOST } from "..";
import Alert from "../Components/Alert";
import LoadingScreen from "../Components/LoadingScreen";
import { OurContext } from "../OurContext";
import general from "../styles/general.module.scss";
import css from "../styles/userDashboard.module.scss";
import { AuthLevel } from "../Models";
const UserDashboard = (): JSX.Element => {
  document.title = "Dashboard";

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);
  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);
  const [dname, setDname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(true);
  const [misc, setMisc] = useState<string>("");
  const context = useContext(OurContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_HOST}/user`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then((body) => {
        context.setUser(body.content);
        setLoaded(true);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loaded) {
    return (
      <div className={css.dashboard}>
        <div className={css["dashboard-content"]}>
          <h1>
            Hey, {context.user?.name}{" "}
            {context.user?.authLevel === AuthLevel.Admin ? (
              <img src={""} width="100px" />
            ) : null}
          </h1>
          <h4>Meine Fächer</h4>
          <i>Coming soon...</i>
          <h4>Dein Profil</h4>
          <form action="" id={css.profile}>
            <p>Email</p>
            <input type="text" placeholder={context.user?.email} disabled />
            <p>Name</p>
            <input type="text" placeholder={context.user?.name} disabled />
            <p>
              Auth-Level: {context.user?.authLevel}{" "}
              {context.user?.authLevel === 1 ? "(Benutzer)" : "Administrator"}
            </p>
            <p>Sonstiges</p>
            <textarea
              value={misc}
              onChange={(e) => {
                setMisc(e.target.value);
                console.log(context.user?.misc, misc);
              }}
              placeholder={context.user?.misc}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                fetch(`${API_HOST}/user`, {
                  method: "PUT",
                  credentials: "include",
                  body: JSON.stringify({ misc }),
                  headers: { "content-type": "application/json" },
                }).then(async (res) => {
                  const body = await res.json();
                  if (!res.ok) {
                    Alert(
                      `Irgendwas ist schief gegangen: ${body.msg}`,
                      "error",
                      context.theme
                    );
                  } else {
                    Alert("Sonstiges geändert!", "success", context.theme);
                  }
                });
              }}
            >
              Bestätigen
            </button>
          </form>

          <h4>Danger Zone</h4>
          <div className={css["danger-zone"]}>
            <div className={css["danger-item"]}>
              <div>
                <p className={css["danger-action"]}>Account löschen</p>
                <p className={css["danger-description"]}>
                  Sobald du deinen Account gelöscht hast, wirst du nicht mehr in
                  der Suche angezeigt und kannst nicht mehr darauf zugreifen.
                </p>
              </div>
              <button
                onClick={() => setModalVisible(!modalVisible)}
                className={general["text-button"]}
              >
                Account löschen
              </button>
            </div>
            <div
              className={css["modal-background"]}
              style={{ display: modalVisible ? "flex" : "none" }}
            >
              <div className={css["modal-content"]} onClick={() => {}}>
                <div className={css["modal-heading-row"]}>
                  <h1>Account löschen</h1>
                  <button
                    onClick={() => setModalVisible(false)}
                    className={css["close-button"]}
                  >
                    &times;
                  </button>
                </div>
                <hr />
                <p>Diese Aktion ist ir­re­ver­si­bel!</p>
                <p>
                  Bitte gib zum Bestätigen{" "}
                  <span className={css.name}>{context.user?.name}</span>ein.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetch(`${API_HOST}/user`, {
                      method: "DELETE",
                      credentials: "include",
                    }).then((res) => {
                      if (!res.ok) {
                        Alert(
                          "Irgendwas ist schiefgegangen.",
                          "error",
                          context.theme
                        );
                      } else {
                        Alert("Account gelöscht.", "info", context.theme);
                      }
                    });
                  }}
                >
                  <input
                    type="text"
                    placeholder=""
                    value={dname}
                    onChange={(e) => {
                      setDname(e.target.value);
                    }}
                  />
                  <input
                    type="submit"
                    value="Löschen"
                    disabled={dname !== context.user?.name}
                    onSubmit={() => setDname("")}
                  />
                </form>
              </div>
            </div>
            <hr />
            <div className={css["danger-item"]}>
              <div>
                <p className={css["danger-action"]}>E-Mail ändern</p>
                <p className={css["danger-description"]}>
                  Ändere deine E-Mail, wenn du eine eigene benutzen willst.
                </p>
              </div>
              <button
                onClick={(e) => {
                  setEmailModalVisible(!emailModalVisible);
                }}
                className={general["text-button"]}
              >
                E-Mail ändern
              </button>
            </div>
            <div
              className={css["modal-background"]}
              style={{ display: emailModalVisible ? "flex" : "none" }}
            >
              <div className={css["modal-content"]} onClick={() => {}}>
                <div className={css["modal-heading-row"]}>
                  <h1>E-Mail ändern</h1>
                  <button
                    onClick={() => setEmailModalVisible(false)}
                    className={css["close-button"]}
                  >
                    &times;
                  </button>
                </div>
                <hr />
                <p>
                  Bitte gib zum Bestätigen{" "}
                  <span className={css.name}>{context.user?.name}</span>ein.
                </p>

                {/* this form is there so the user can submit via pressing escape or the key on their mobile keyboard */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO
                    fetch(`${API_HOST}/user`, {
                      method: "PUT",
                      credentials: "include",
                      body: JSON.stringify({ email }),
                      headers: { "content-type": "application/json" },
                    }).then(async (res) => {
                      const body = await res.json();
                      if (!res.ok) {
                        Alert(
                          `Irgendwas ist schief gegangen: ${body.msg}`,
                          "error",
                          context.theme
                        );
                      } else {
                        Alert("E-Mail geändert!", "success", context.theme);
                      }
                    });
                  }}
                >
                  <input
                    type="text"
                    placeholder=""
                    value={dname}
                    onChange={(e) => {
                      setDname(e.target.value);
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder=" Neue E-Mail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                  <input
                    type="submit"
                    value="Ändern"
                    disabled={
                      dname !== context.user?.name ||
                      !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
                        email
                      )
                    }
                    onSubmit={() => setDname("")}
                  />
                </form>
              </div>
            </div>
            <hr />
            <div className={css["danger-item"]}>
              <div>
                <p className={css["danger-action"]}>Namen ändern</p>
                <p className={css["danger-description"]}>
                  Ändere deine Namen, wenn du ihn amtlich geändert hast oder
                  nicht willst, dass dein Nachname einsehbar ist.
                </p>
              </div>
              <button
                onClick={(e) => {
                  setNameModalVisible(!nameModalVisible);
                }}
                className={general["text-button"]}
              >
                Namen ändern
              </button>
            </div>
            <div
              className={css["modal-background"]}
              style={{ display: nameModalVisible ? "flex" : "none" }}
            >
              <div className={css["modal-content"]} onClick={() => {}}>
                <div className={css["modal-heading-row"]}>
                  <h1>Namen ändern</h1>
                  <button
                    onClick={() => setNameModalVisible(false)}
                    className={css["close-button"]}
                  >
                    &times;
                  </button>
                </div>
                <hr />
                <p>
                  Bitte gib zum Bestätigen{" "}
                  <span className={css.name}>{context.user?.name}</span>ein.
                </p>

                {/* this form is there so the user can submit via pressing escape or the key on their mobile keyboard */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO
                    fetch(`${API_HOST}/user`, {
                      method: "PUT",
                      credentials: "include",
                      body: JSON.stringify({ name }),
                      headers: { "content-type": "application/json" },
                    }).then(async (res) => {
                      const body = await res.json();
                      if (!res.ok) {
                        Alert(
                          `Irgendwas ist schief gegangen: ${body.msg}`,
                          "error",
                          context.theme
                        );
                      } else {
                        Alert("E-Mail geändert!", "success", context.theme);
                      }
                    });
                  }}
                >
                  <input
                    type="text"
                    placeholder=""
                    value={dname}
                    onChange={(e) => {
                      setDname(e.target.value);
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder=" Neuer Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                  <input
                    type="submit"
                    value="Ändern"
                    disabled={dname !== context.user?.name || name === ""}
                    onSubmit={() => setDname("")}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else return <LoadingScreen loaded={loaded} />;
};

export default UserDashboard;
