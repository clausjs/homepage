import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { fields } = widget;

  const { data: monitored, error: monitoredErrors } = useWidgetAPI(widget, "volumes", { filter: "monitored" });
  const { data: queue, error: queueErrors } = useWidgetAPI(widget, "queue");
  const { data: wanted, error: wantedErrors } = useWidgetAPI(widget, "wanted", { filter: "wanted" });
  const { data: history, error: historyErrors } = useWidgetAPI(widget, "history");
  const { data: blocked, error: blockedErrors } = useWidgetAPI(widget, "blocked");

  if (monitoredErrors || queueErrors || wantedErrors || historyErrors || blockedErrors) {
    let finalError;
    if (monitoredErrors) finalError = monitoredErrors;
    if (queueErrors) finalError = queueErrors;
    if (wantedErrors) finalError = wantedErrors;
    if (historyErrors) finalError = historyErrors;
    if (blockedErrors) finalError = blockedErrors;
    return <Container service={service} error={finalError} />;
  }

  if (!monitored || !queue || !wanted || !history || !blocked) {
    return (
      <Container service={service}>
        <Block label="kapowarr.monitored" />
        <Block label="kapowarr.queued" />
        <Block label="kapowarr.wanted" />
        <Block label="kapowarr.history" />
        <Block label="kapowarr.blocked" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="kapowarr.monitored" value={t("common.number", { value: monitored.result.length })} />
      <Block label="kapowarr.queued" value={t("common.number", { value: queue.result.length })} />
      <Block label="kapowarr.wanted" value={t("common.number", { value: wanted.result.length })} />
      <Block label="kapowarr.history" value={t("common.number", { value: history.result.length })} />
      <Block label="kapowarr.blocked" value={t("common.number", { value: blocked.result.length })} />
    </Container>
  );
}
