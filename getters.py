import sqlite3
import pandas as pd

#getters for DB

conn = sqlite3.connect("ML_Project_State_Prediction/NBA_db.db")

def getAllPlayers(conn):
    df = pd.read_sql_query(f"SELECT * from Players",conn)
    return df

def getTeams(conn):
    tables = {}
    teams = getAllPlayers(conn).groupby('Team')
    for name,group in teams:
        tables[name] = group.reset_index(drop=True)
    return tables
getTeams(conn)
def getPlayer(Column,Value,conn):
    df = pd.read_sql_query(f"SELECT * from Players where {Column} = '{Value}'",conn)
    return df

def getBoxScore(Column,Value):
    print(Column,Value)
    df1 = pd.read_sql_query(f"SELECT * from BoxScoreBasic where {Column} = '{Value}'",conn)
    df2 = pd.read_sql_query(f"SELECT * from BoxScoreAdvanced where {Column} = '{Value}'",conn)
    return df1,df2

def getPlayByPlay(Token):
    df = pd.read_sql_query(f"SELECT * from PlayByPlay where Token = '{Token}'",conn)
    return df

def getSchedule():
    df = pd.read_sql_query(f"SELECT * from Schedule",conn)
    return df

def get_play_by_type(play_type,token):
    # Dictionary of play type keywords
    play_keywords = {
        "shot_made": "makes",
        "shot_missed": "misses",
        "offensive_rebound": "offensive rebound",
        "defensive_rebound": "defensive rebound",
        "assist": "assists",
        "turnover": "turnover",
        "foul": "foul",
        "free_throw_made": "makes free throw",
        "free_throw_missed": "misses free throw",
        "steal": "steal",
        "block": "block",
        "jump_ball": "jump ball",
        "substitution": "enters",
        "timeout": "timeout",
        "violation": "violation"
    }

    # Validate play type
    if play_type not in play_keywords:
        raise ValueError(f"Invalid play type: {play_type}. Choose from {list(play_keywords.keys())}")

    # Query database
    if token=="*":
        query = """
        SELECT * FROM PlayByPlay
        WHERE (AwayTeamPlay LIKE ? OR HomeTeamPlay LIKE ?);
        """
    else:
        query = """
        SELECT * FROM PlayByPlay
        WHERE Token LIKE ? 
        AND (AwayTeamPlay LIKE ? OR HomeTeamPlay LIKE ?);
        """


    params = (f"%{token}%", f"%{play_keywords[play_type]}%", f"%{play_keywords[play_type]}%")

    df = pd.read_sql(query, conn, params=params)
    return df
