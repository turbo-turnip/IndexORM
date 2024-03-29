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
export const Decimal = () => ({
    SQLType: "DECIMAL",
    params: []
});
export const Float = () => ({
    SQLType: "FLOAT",
    params: []
});
export const Boolean = () => ({
    SQLType: "BOOL",
    params: []
});
export const VarChar = (charLimit) => ({
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