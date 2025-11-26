import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'drawing_fml', schema: 'pdm' })
export class ExpLocalPdm {
  @PrimaryColumn()
  basket_id: number;
  @PrimaryColumn()
  drawing_no: string;
  @PrimaryColumn()
  revision_no: string;
  @PrimaryColumn()
  internal_revision_no: number;
  @Column()
  latest_flg: string;
  @Column()
  current_flg: string;
  @Column()
  size_code: string;
  @Column()
  title_english: string;
  @Column()
  title_local: string;
  @Column()
  drawing_tool: string;
  @Column()
  total_pages: number;
  @Column()
  company: string;
  @Column()
  confidential_lvl: string;
  @Column()
  appar: string;
  @Column()
  item_no: string;
  @Column()
  drawing_cls: string;
  @Column()
  scale: string;
  @Column()
  cad3d_cls: string;
  @Column()
  draw_start_revno: string;
  @Column()
  cam_cls: string;
  @Column()
  part_ssy_dwg: string;
  @Column()
  level0_dwg_flg: string;
  @Column()
  instllation_dwg_flg: string;
  @Column()
  instllation_dwg_ina: string;
  @Column()
  mat_cert_ctrl: string;
  @Column()
  special_mention_1: string;
  @Column()
  special_mention_2: string;
  @Column()
  special_mention_3: string;
  @Column()
  special_mention_4: string;
  @Column()
  remarks_1: string;
  @Column()
  remarks_2: string;
  @Column()
  set_prdn: string;
  @Column()
  urgent: string;
  @Column()
  ord_prj_no: string;
  @Column()
  start_term_class: string;
  @Column()
  start_term_ymj: string;
  @Column()
  reason_code: string;
  @Column()
  revision_type_1: string;
  @Column()
  revision_type_2: string;
  @Column()
  revision_note: string;
  @Column()
  necessity_melina_apr: string;
  @Column()
  rslt_melina_apr: string;
  @Column()
  rev_rslt_melina_apr: string;
  @Column()
  ref_drawing_no: string;
  @Column()
  ref_revision_no: string;
  @Column()
  hyou_check_result: string;
  @Column()
  hyou_check_date: Date;
  @Column()
  hyou_update_date: Date;
  @Column()
  hyou_arrange_date: Date;
  @Column()
  tiff_create_date: Date;
  @Column()
  revision_flg: string;
  @Column()
  appropriation_flg: string;
  @Column()
  basket_id_org: number;
  @Column()
  create_sectionid: string;
  @Column()
  create_userid: string;
  @Column()
  drawing_status: string;
  @Column()
  drawer_username: string;
  @Column()
  drawer_section: string;
  @Column()
  drawer_date: Date;
  @Column()
  drawer_position: string;
  @Column()
  designer_section: string;
  @Column()
  designer_username: string;
  @Column()
  designer_date: Date;
  @Column()
  designer_position: string;
  @Column()
  checker_section: string;
  @Column()
  checker_username: string;
  @Column()
  checker_date: Date;
  @Column()
  checker_position: string;
  @Column()
  tecapprover_section: string;
  @Column()
  tecapprover_username: string;
  @Column()
  tecapprover_date: Date;
  @Column()
  tecapprover_position: string;
  @Column()
  ttlapprover_section: string;
  @Column()
  ttlapprover_username: string;
  @Column()
  ttlapprover_date: Date;
  @Column()
  ttlapprover_position: string;
  @Column()
  create_datetime: Date;
  @Column()
  update_datetime: Date;
  @Column()
  latest_released_flg: string;
  @Column()
  local_approval_date: Date;
  @Column()
  arrival_date_from_melina: Date;
  @Column()
  old_rev: string;
  @Column()
  part_ssy_dwg_other: string;
  @Column()
  attribute_rev_flg: string;
  @Column()
  create_class: string;
  @Column()
  export_class_cd: string;
  @Column()
  export_no: string;
  @Column()
  export_check_cd: string;
  @Column()
  export_ear_type: string;
  @Column()
  export_ear: string;
  @Column()
  export_check_date: Date;
  @Column()
  export_check_sectionid: string;
  @Column()
  export_check_sectionname: string;
  @Column()
  export_check_userid: string;
  @Column()
  export_check_username: string;
  @Column()
  ref_export_no: string;
  @Column()
  ref_export_ear: string;
  @Column()
  ref_export_date: Date;
  @Column()
  ref_export_sectionname: string;
  @Column()
  ref_export_username: string;
  @Column()
  lastapprover_section_id: string;
  @Column()
  lastapprover_section_name: string;
  @Column()
  car: string;
  @Column()
  ref_export_class_cd: string;
  @Column()
  ref_export_check_cd: string;
  @Column()
  ref_mat_cert_ctrl: string;
  @Column()
  ref_level0_dwg_flg: string;
  @Column()
  ref_instllation_dwg_flg: string;
  @Column()
  trial_flg: string;
  @Column()
  hyou_send_finish_flg: string;
  @Column()
  export_flg: string;
  @Column()
  cad3d_mod_req_flg: string;
  @Column()
  proi_rev_status: string;
  @Column()
  proi_rev_updatetime: Date;
  @Column()
  base_line_name: string;
  @Column()
  cad3d_model_name: string;
  @Column()
  cad3d_modify_1: string;
  @Column()
  cad3d_modify_2: string;
  @Column()
  cad3d_modify_3: string;
  @Column()
  cad3d_modify_memo: string;
  @Column()
  cad3d_data_status: string;
  @Column()
  cad3d_data_updatetime: Date;
  @Column()
  cadcam_chk_judge: string;
  @Column()
  tif_ul_flg: string;
  @Column()
  rzu_line: string;
  @Column()
  rzu_condition: string;
  @Column()
  rzu_prohibition: string;
  @Column()
  rzu_term_ymd: string;
  @Column()
  rzu_drawing_no: string;
  @Column()
  iso_flg: string;
  @Column()
  mzu_ftstat: string;
  @Column()
  cadcam_selfchk_judge: string;
  @Column()
  hyou_mth_flg: string;
  @Column()
  hyou_mtg_flg: string;
  @Column()
  hyou_mtl_flg: string;
  @Column()
  hyou_mtaa_flg: string;
  @Column()
  hyou_mtab_flg: string;
  @Column()
  hyou_mtac_flg: string;
  @Column()
  hyou_mtad_flg: string;
  @Column()
  hyou_mtae_flg: string;
  @Column()
  hyou_mtqq_flg: string;
  @Column()
  hyou_mtqr_flg: string;
  @Column()
  hyou_mtf_flg: string;
  @Column()
  hyou_mtp_flg: string;
  @Column()
  hyou_mtw_flg: string;
  @Column()
  cadcam_chk_no: string;
  @Column()
  cadcam_chk_userid: string;
  @Column()
  cadcam_chk_status: string;
  @Column()
  cadcam_chk_datetime: Date;
}
