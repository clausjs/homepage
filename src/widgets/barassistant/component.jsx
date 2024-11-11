import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data: barsData, error: barsError } = useWidgetAPI(widget, "bars");
  const { data: totalCocktailsData, error: cocktailsError } = useWidgetAPI(widget, "totalCocktails", {
    bar_id: widget?.barId,
    per_page: widget?.maxCocktails ?? 999,
  });
  const { data: shelfCocktailsData, error: shelfCocktailsError } = useWidgetAPI(widget, "shelfCocktails", {
    bar_id: widget?.barId,
  });

  if (barsError || cocktailsError || shelfCocktailsError) {
    let finalError;
    if (barsError) finalError = barsError;
    else if (cocktailsError) finalError = cocktailsError;
    else if (shelfCocktailsError) finalError = cocktailsError;
    return <Container service={service} error={finalError} />;
  }

  if (!barsData || !totalCocktailsData || !shelfCocktailsData) {
    return (
      <Container service={service}>
        <Block label="Bar(s)" />
        <Block label="Total Cocktails" />
        <Block label="Shelf Cocktails" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block
        label={barsData.data.length > 1 ? "Bars" : "Bar"}
        value={t("common.number", { value: barsData.data.length })}
      />
      <Block label="Total Cocktails" value={t("common.number", { value: totalCocktailsData.meta.total })} />
      <Block label="Shelf Cocktails" value={t("common.number", { value: shelfCocktailsData.data.length })} />
    </Container>
  );
}
