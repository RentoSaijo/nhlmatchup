extract_espn_team_id <- function(href) {
  as.integer(str_extract(href, '(?<=/teams/)\\d+'))
}
extract_espn_athlete_id <- function(href) {
  as.integer(str_extract(href, '(?<=/athletes/)\\d+'))
}
extract_espn_event_id <- function(href) {
  as.integer(str_extract(href, '(?<=/events/)\\d+'))
}
