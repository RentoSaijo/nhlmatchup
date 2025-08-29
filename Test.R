# Load libraries.
library(nhlscraper)
suppressMessages(library(tidyverse))

# Source helper functions.
source('R/utility.R')

# Get today's date.
today <- Sys.Date()

# Match NHL and ESPN games.
events_20252026 <- get_espn_events(20251007, 20260418) %>% 
  mutate(event=extract_espn_event_id(`$ref`))
games_20252026 <- get_games() %>% 
  filter(season==20252026 & gameType==2) %>% 
  mutate(event=events_20252026$event)
