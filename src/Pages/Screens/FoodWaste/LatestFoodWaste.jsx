import { useContext } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import FoodWasteColorScheme, { GREY_TEXT_CLOR } from "./FoodWasteColorScheme";
import { ScreenContext } from "../../../ContextProviders/ScreenContext";
import { Textfit } from "react-textfit";
import { FoodWasteContext } from "./FoodWasteContext";

const FOOD_WASTE_IN_KG_TO_MEAL_RATIO = 2;

const LatestFoodWaste = () => {
    const { isLayoutReversed } = useContext(ScreenContext);
    const { historical, lastWeek, lastSemester, dailyGoal } = useContext(FoodWasteContext);
    const latestFoodWaste = historical?.[0] || { timestamp: null, value: null };

    const colorForLatestFoodWaste = (() => {
        if (!latestFoodWaste.value || !dailyGoal) return null;

        const ratio = latestFoodWaste.value / dailyGoal;

        if (ratio < 0.9) return FoodWasteColorScheme.low;
        if (ratio <= 1.1) return FoodWasteColorScheme.medium;
        return FoodWasteColorScheme.high;
    })();

    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            height="100%"
            textAlign="center"
        >
            <Stack py={3} px={3} sx={{ background: "unset" }}>
                <Typography fontWeight="500" color="white">
                    <Textfit mode="single">
                        GOAL: Keep Daily Food Waste Under
                    </Textfit>
                </Typography>

                <Typography variant="h2" color={FoodWasteColorScheme.low}>
                    {dailyGoal || "--"} kg
                </Typography>
            </Stack>

            <Stack py={3} px={3} flex={1} justifyContent="space-between">
                <Stack flex={1} justifyContent="space-evenly"
                    sx={{
                        '& .flashingRed': {
                            '& .MuiTypography-root ': {
                                color: `${FoodWasteColorScheme.high} !important`,
                                opacity: 0.8
                            },
                            color: `${FoodWasteColorScheme.high} !important`,
                            animation: 'flashingRed 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
                            '@keyframes flashingRed': {
                                '0%': {
                                    opacity: 1
                                },
                                '50%': {
                                    opacity: 0.5
                                },
                                '100%': {
                                    opacity: 1
                                }
                            }
                        }
                    }}
                >
                    {
                        latestFoodWaste.value ?
                            <Stack px={2} alignItems="center">
                                <Stack width="100%" direction="row" alignItems="baseline">
                                    <Typography
                                        flex={1}
                                        color={colorForLatestFoodWaste}
                                        className={`${colorForLatestFoodWaste === FoodWasteColorScheme.high && "flashingRed"}`}
                                    >
                                        <Textfit mode="single">
                                            {latestFoodWaste.value} kg
                                            =&nbsp;
                                            {latestFoodWaste.value * FOOD_WASTE_IN_KG_TO_MEAL_RATIO}
                                        </Textfit>
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={colorForLatestFoodWaste}
                                        className={`${colorForLatestFoodWaste === FoodWasteColorScheme.high && "flashingRed"}`}
                                    >&nbsp;meals*</Typography>
                                </Stack>

                                <Typography width="75%" color={GREY_TEXT_CLOR}>
                                    <Textfit mode="single">
                                        thrown in the garbage
                                    </Textfit>
                                </Typography>
                            </Stack>
                            :
                            <Typography variant="h1" color={GREY_TEXT_CLOR}>--</Typography>
                    }

                    <Typography variant="h4" color={GREY_TEXT_CLOR}>
                        {latestFoodWaste.timestamp?.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) || "--"}
                    </Typography>

                    <Grid container item>
                        {latestFoodWaste.value && lastWeek && (
                            <Grid item xs={6}>
                                <FoodWasteComparison
                                    current={latestFoodWaste.value}
                                    comparedWith={lastWeek}
                                    periodLabel="last week avg"
                                />
                            </Grid>
                        )}

                        {latestFoodWaste.value && lastSemester && (
                            <Grid item xs={6}>

                                <FoodWasteComparison
                                    current={latestFoodWaste.value}
                                    comparedWith={lastSemester}
                                    periodLabel="last semester avg"
                                />
                            </Grid>
                        )}
                    </Grid>
                </Stack >

                <Typography variant="h6" color="white" textAlign={isLayoutReversed ? "right" : "left"}>*1 meal ~ 0.5 kg food waste</Typography>
            </Stack>
        </Stack >

    );
}

const FoodWasteComparison = ({ current, comparedWith, periodLabel }) => {
    if (current == null || comparedWith == null) return null;

    const currentMeals = Math.round(current * FOOD_WASTE_IN_KG_TO_MEAL_RATIO);
    const comparedMeals = Math.round(comparedWith * FOOD_WASTE_IN_KG_TO_MEAL_RATIO);
    const diff = comparedMeals - currentMeals; // positive means “current is less”

    const color =
        current < comparedWith
            ? FoodWasteColorScheme.low
            : current === comparedWith
                ? FoodWasteColorScheme.medium
                : FoodWasteColorScheme.high;

    return (
        <Stack alignItems="center">
            <Stack direction="row" gap={1} alignItems="end">
                <Typography variant="h4" color={color} display="inline" mb={-0.5}>
                    <Typography variant="h2" color={color} display="inline">
                        {Math.abs(diff)}
                    </Typography>

                    &nbsp;meals
                </Typography>

                <Stack display="inline-flex" direction="column">
                    <Typography variant="h4" color={color} component="span" mb={-1.5}>
                        {diff > 0 ? <>▼</> : <>▲</>}
                    </Typography>
                    <Typography variant="h6" color={color} component="span">
                        {diff > 0 ? <>less</> : <>more</>}
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="h4" color={GREY_TEXT_CLOR}>
                than {periodLabel}
            </Typography>
        </Stack>
    );
};

export default LatestFoodWaste;