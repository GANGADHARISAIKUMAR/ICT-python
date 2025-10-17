import os
import streamlit as st
import pandas as pd
import plotly.express as px

# --- Page Config ---
st.set_page_config(
    page_title="Placement Dashboard",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Optional: Load a header background image (professional banner)
HEADER_IMAGE_PATH = "header_banner.jpg"
header_style = None
if os.path.exists(HEADER_IMAGE_PATH):
    header_style = f"""
    <style>
        .header {{
            background-image: url('{HEADER_IMAGE_PATH}');
            background-size: cover;
            background-position: center;
            border-radius: 0px;
            padding: 40px 20px;
            color: white;
        }}
        .header h1 {{
            color: white;
        }}
    </style>
    """

# --- Page Title & Subheader (with optional banner) ---
if header_style:
    st.markdown(header_style, unsafe_allow_html=True)

st.markdown("""
<div style="text-align: center;">
    <h1 style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; font-weight: 700;">
        🎓 Placement Data Analytics Dashboard
    </h1>
    <p style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #555;">
        Insightful visualizations and metrics from 2018 to 2025
    </p>
</div>
""", unsafe_allow_html=True)

st.markdown("---")

# --- Load Data ---
csv_path = "NNRG_Placement_2018_2025.csv"

@st.cache_data(show_spinner=False)
def load_data(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        return pd.DataFrame(columns=['Year', 'Branch', 'Name of the Employer'])
    df = pd.read_csv(path)
    expected_cols = {'Year', 'Branch', 'Name of the Employer'}
    if not expected_cols.issubset(set(df.columns)):
        return pd.DataFrame(columns=['Year', 'Branch', 'Name of the Employer'])
    return df

df = load_data(csv_path)

# --- Sidebar Filter ---
st.sidebar.header("📅 Filter by Year")
years = sorted(df['Year'].astype(str).unique().tolist())
selected_year = st.sidebar.selectbox("Select Year", ["All"] + years, index=0)

# --- Filter Data Based on Selection ---
if selected_year == "All":
    filtered_df = df.copy()
else:
    filtered_df = df[df['Year'].astype(str) == selected_year]

# --- Summary Metrics ---
total_students = int(df.shape[0])
total_branches = int(df['Branch'].nunique())
total_recruiters = int(df['Name of the Employer'].nunique())
total_placements = int(filtered_df.shape[0])

col1, col2, col3, col4 = st.columns(4)
col1.metric("👨‍🎓 Total Students", f"{total_students:,}")
col2.metric("🏫 Unique Branches", f"{total_branches:,}")
col3.metric("🏢 Total Recruiters", f"{total_recruiters:,}")
col4.metric("🎯 Total Placements", f"{total_placements:,}")

st.markdown("---")

# --- Top Branch of the Year ---
if selected_year != "All":
    st.subheader(f"🏆 Top Branch in {selected_year}")
    if not filtered_df.empty:
        top_branch = filtered_df['Branch'].value_counts().idxmax()
        top_branch_count = filtered_df['Branch'].value_counts().max()
        st.success(f"🎓 {top_branch} had the highest placements in {selected_year} with {top_branch_count} students.")
    else:
        st.warning("No data available for the selected year.")
    st.markdown("---")

# --- Side-by-side Graphs ---
col1, col2 = st.columns(2)

# 1️⃣ Year-wise placement bar chart (from full data)
if not df.empty:
    year_counts = df['Year'].value_counts().sort_index()
    fig_bar = px.bar(
        x=year_counts.index.astype(str),
        y=year_counts.values,
        color=year_counts.index.astype(str),
        labels={'x': 'Year', 'y': 'Number of Placements'},
        title="📊 Year-wise Placement Count",
        color_discrete_sequence=px.colors.qualitative.Plotly
    )
    fig_bar.update_layout(showlegend=False, template="none")
    col1.plotly_chart(fig_bar, use_container_width=True)

# 2️⃣ Pie chart: Branch-wise distribution for selected year/all
if not filtered_df.empty:
    branch_counts = filtered_df['Branch'].value_counts()
    fig_pie = px.pie(
        names=branch_counts.index,
        values=branch_counts.values,
        title=f"🧭 Branch-wise Distribution ({'All Years' if selected_year == 'All' else selected_year})",
        color_discrete_sequence=px.colors.qualitative.Plotly
    )
    col2.plotly_chart(fig_pie, use_container_width=True)

st.markdown("---")

# --- Treemap: Branch-wise placement ---
if not filtered_df.empty:
    branch_counts_df = filtered_df['Branch'].value_counts().reset_index()
    branch_counts_df.columns = ['Branch', 'Count']
    fig_treemap = px.treemap(
        branch_counts_df,
        path=['Branch'],
        values='Count',
        title=f"🌳 Branch-wise Placement Treemap ({'All Years' if selected_year == 'All' else selected_year})"
    )
    st.plotly_chart(fig_treemap, use_container_width=True)
else:
    st.info("No treemap available for the selected year.")

st.markdown("---")

# --- Recruiter-wise Placement Count ---
st.subheader(f"🏢 Top Recruiters ({'All Years' if selected_year == 'All' else selected_year})")
if not filtered_df.empty:
    recruiter_counts = filtered_df['Name of the Employer'].value_counts().reset_index()
    recruiter_counts.columns = ['Recruiter', 'Placements']
    fig_recruiters = px.bar(
        recruiter_counts.head(10),
        x='Recruiter',
        y='Placements',
        color='Placements',
        title=f"Top 10 Recruiters ({'All Years' if selected_year == 'All' else selected_year})",
        color_continuous_scale=px.colors.sequential.Blues
    )
    fig_recruiters.update_layout(showlegend=False)
    st.plotly_chart(fig_recruiters, use_container_width=True)
else:
    st.info("No recruiter data available for the selected year.")

st.markdown("---")

# --- Full Data Table ---
st.subheader("📋 Full Placement Data")
st.dataframe(filtered_df.reset_index(drop=True), use_container_width=True)

st.markdown("---")

