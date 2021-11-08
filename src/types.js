export const SmallInt = (limit) => ({
    SQLType: "SMALLINT(" + limit + ")",
    params: [limit]
});
export const Int = () => ({
    SQLType: "INT",
    params: []
});
export const BigInt = (limit) => ({
    SQLType: "BIGINT(" + limit + ")",
    params: [limit]
});
export const Decimal = (limit) => ({
    SQLType: "DECIMAL(" + limit + ")",
    params: [limit]
});
export const Float = (limit) => ({
    SQLType: "FLOAT(" + limit + ")",
    params: [limit]
});
export const Boolean = () => ({
    SQLType: "BOOL",
    params: []
});
export const VarChar = (charlimit) => ({
    SQLType: "VARCHAR(" + charLimit + ")",
    params: [charLimit]
});
export const Text = () => ({
    SQLType: "TEXT",
    params: []
});
export const Date = () => ({
    SQLType: "DATE",
    params: []
});
export const Time = () => ({
    SQLType: "TIME",
    params: []
});
export const DateTime = () => ({
    SQLType: "DATETIME",
    params: []
});
export const TimeStamp = () => ({
    SQLType: "TIMESTAMP",
    params: []
});
export const Year = () => ({
    SQLType: "YEAR",
    params: []
});
export const JSON = () => ({
    SQLType: "JSON",
    params: []
});